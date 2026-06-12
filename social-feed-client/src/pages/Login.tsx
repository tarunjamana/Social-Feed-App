import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "../graphql/mutations/auth";
import useAuthStore from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [loginMutation, { loading, error: mutationError }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    const { data } = await loginMutation({ variables: { email, password } });
    if (data) {
      setAuth(data.login.accessToken, data.login.user);
      navigate("/feed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">SocialFeed</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
        >
          <Input
            error={errors.email}
            label="Email"
            id="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <Input
            error={errors.password}
            label="Password"
            type="password"
            id="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {mutationError && (
            <p className="text-red-500 text-sm">{mutationError.message}</p>
          )}
          <Button isLoading={loading} type="submit">
            Log in
          </Button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
