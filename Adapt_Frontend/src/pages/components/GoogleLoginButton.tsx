import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log("Google login:", credentialResponse);
        // salvar dados ou redirecionar
      }}
      onError={() => console.log("Erro no login do Google")}
      width="100%"
    />
  );
}

export default GoogleLoginButton;
