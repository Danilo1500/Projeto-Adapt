import { useMsal } from "@azure/msal-react";

function MicrosoftLoginButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().then(response => {
      console.log("Microsoft login:", response);
      // salvar dados ou redirecionar
    });
  };

  return (
    <button className="microsoft-btn" onClick={handleLogin}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
        alt="Microsoft"
      />
      Continuar com a Microsoft
    </button>
  );
}

export default MicrosoftLoginButton;
