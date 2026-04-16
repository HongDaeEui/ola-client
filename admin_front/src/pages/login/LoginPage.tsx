import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {useState, FormEvent} from "react";
import { useAuthStore } from "@/stores/auth_store";
import { useNavigate } from "react-router-dom";
import BaseButton from "@/components/common/BaseButton";
import "./login.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const { logIn, loading } = useAuthStore();
  const navigate = useNavigate();

  const isFormValid = loginId.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId || !password) {
      alert("Please enter your ID and password.");
      return;
    }

    const result = await logIn({ loginId, password});

    if (result.success) {
      navigate("/");
    } else {
      alert("Login failed. Please check your ID and password.");
    }
  };

  return (
    <div className="login-wrapper ">
      <div className="login-header">
        <span>Admin Login</span>
      </div>
      <form onSubmit={handleSubmit} >
        <div className="login-input-wrap login-id-input">
          <span>ID</span>
          <Input
            type="text"
            placeholder="ID"
            className="id-input login-input"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="login-password-input">
          <span>Password</span>
          <div className="relative flex items-center">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="password-input login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 top-1"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className={'mb-3'}>
          <BaseButton
            type="submit"
            label="Sign In"
            height="36px"
            width="100%"
            color={!isFormValid || loading ? 'lightgray' : 'red'}
            disabled={!isFormValid || loading}
            borderRadius="8px"
          />
        </div>
        <div className="login-info-wrapper">
          <span className="login-info ">Please contact the administrator if you lost your account.</span>
        </div>
      </form>
    </div>
  )
}
