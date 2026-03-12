import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        // salvar dados ou redirecionar
      }}
      width="100%"
    />
  );
}

export default GoogleLoginButton;

