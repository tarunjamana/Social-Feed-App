import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useMutation } from "@apollo/client/react";
import useAuthStore from "../store/authStore";
import { REGISTER_MUTATION } from "../graphql/mutations/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const [registerMutation, { loading, error: mutationError }] = useMutation(REGISTER_MUTATION);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newErrors = { username: "", displayName: "", email: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (/\s/.test(username)) {
      newErrors.username = "Username cannot contain spaces";
    }

    if (!displayName.trim()) newErrors.displayName = "Display name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    if (newErrors.username || newErrors.displayName || newErrors.email || newErrors.password) return;

    const { data } = await registerMutation({ variables: { username, displayName, email, password } });
    if (data) {
      setAuth(data.register.accessToken, data.register.user);
      navigate("/feed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">SocialFeed</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
        >
          <Input
            error={errors.username}
            label="Username"
            id="username"
            placeholder="yourhandle"
            onChange={(e) => setUserName(e.target.value)}
            value={username}
          />
          <Input
            error={errors.displayName}
            label="Display Name"
            id="displayName"
            placeholder="Your Name"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
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
            Create account
          </Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
