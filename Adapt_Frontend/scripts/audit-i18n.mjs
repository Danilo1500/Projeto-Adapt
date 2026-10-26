import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");
const contextPath = path.join(sourceRoot, "context/LanguageContext.jsx");
const contextSource = fs.readFileSync(contextPath, "utf8");
const context = ts.createSourceFile(contextPath, contextSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX);
const dictionaries = new Map();
for (const statement of context.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name) || !["portugueseToEnglish", "englishToPortuguese"].includes(declaration.name.text)) continue;
    const entries = new Map();
    const duplicates = [];
    if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
      for (const property of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(property)) continue;
        const key = property.name && (ts.isStringLiteral(property.name) || ts.isIdentifier(property.name)) ? property.name.text : null;
        if (!key || !ts.isStringLiteral(property.initializer)) continue;
        if (entries.has(key)) duplicates.push(key);
        entries.set(key, property.initializer.text);
      }
    }
    dictionaries.set(declaration.name.text, { entries, duplicates });
  }
}
const pt = dictionaries.get("portugueseToEnglish")?.entries || new Map();
const en = dictionaries.get("englishToPortuguese")?.entries || new Map();

const additionalDeclaration = context.statements
  .filter(ts.isVariableStatement)
  .flatMap((statement) => statement.declarationList.declarations)
  .find((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === "additionalTranslations");
const additionalPairs = [];
if (additionalDeclaration?.initializer && ts.isArrayLiteralExpression(additionalDeclaration.initializer)) {
  for (const pair of additionalDeclaration.initializer.elements) {
    if (!ts.isArrayLiteralExpression(pair) || pair.elements.length < 2) continue;
    const [portuguese, english] = pair.elements;
    if (ts.isStringLiteral(portuguese) && ts.isStringLiteral(english)) additionalPairs.push([portuguese.text, english.text]);
  }
}
const additionalDuplicates = additionalPairs.map(([key]) => key).filter((key, index, keys) => keys.indexOf(key) !== index);
for (const [portuguese, english] of additionalPairs) {
  if (!pt.has(portuguese)) pt.set(portuguese, english);
  if (!en.has(english)) en.set(english, portuguese);
}

const files = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(jsx?|tsx?)$/.test(file) && !file.endsWith("LanguageContext.jsx")) files.push(file);
  }
};
walk(sourceRoot);
const staticTexts = new Map();
for (const file of files) {
  const kind = file.endsWith(".tsx") || file.endsWith(".ts") ? ts.ScriptKind.TSX : ts.ScriptKind.JSX;
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, kind);
  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (value && /[\p{L}]/u.test(value) && !staticTexts.has(value)) staticTexts.set(value, path.relative(sourceRoot, file));
    }
    if (ts.isJsxAttribute(node) && ["placeholder", "title", "aria-label", "alt"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer)) {
      if (!staticTexts.has(node.initializer.text)) staticTexts.set(node.initializer.text, path.relative(sourceRoot, file));
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

const missingPt = [...pt].filter(([key, value]) => en.get(value) !== key).map(([key, value]) => `${key} => ${value}`);
const missingEn = [...en].filter(([key, value]) => pt.get(value) !== key).map(([key, value]) => `${key} => ${value}`);
const uncovered = [...staticTexts.keys()].filter((text) => !pt.has(text) && !en.has(text));
console.log(JSON.stringify({
  filesScanned: files.length,
  staticUiTextCount: staticTexts.size,
  portugueseKeys: pt.size,
  englishKeys: en.size,
  duplicatePortugueseKeys: dictionaries.get("portugueseToEnglish")?.duplicates || [],
  duplicateEnglishKeys: dictionaries.get("englishToPortuguese")?.duplicates || [],
  duplicateAdditionalKeys: [...new Set(additionalDuplicates)],
  additionalTranslationPairs: additionalPairs.length,
  asymmetricPortugueseEntries: missingPt.length,
  asymmetricEnglishEntries: missingEn.length,
  uncoveredStaticTexts: uncovered.length,
  uncoveredExamples: uncovered.slice(0, 40).map((text) => ({ text, file: staticTexts.get(text) })),
  asymmetricExamples: { portugueseToEnglish: missingPt.slice(0, 10), englishToPortuguese: missingEn.slice(0, 10) },
}, null, 2));

if (dictionaries.get("portugueseToEnglish")?.duplicates.length || dictionaries.get("englishToPortuguese")?.duplicates.length || additionalDuplicates.length) {
  process.exitCode = 1;
}
