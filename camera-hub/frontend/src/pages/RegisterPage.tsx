import {
  Container, Box, Paper, Typography, TextField, Button, Link as MuiLink, Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../api/auth";

interface FormData {
  email: string;
  username: string;
  password: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.username, data.password);
      navigate("/login");
    } catch (err) {
      const data = (err as { response?: { data?: { email?: string[]; username?: string[] } } })?.response?.data;
      const msg = data?.email?.[0] ?? data?.username?.[0] ?? "Registration failed.";
      setError("root", { message: msg });
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom align="center">
          Create an account
        </Typography>
        {errors.root && <Alert severity="error" sx={{ mb: 2 }}>{errors.root.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            {...register("email", { required: "Required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Username"
            {...register("username", { required: "Required", minLength: { value: 3, message: "Min 3 chars" } })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Password"
            type="password"
            {...register("password", { required: "Required", minLength: { value: 8, message: "Min 8 chars" } })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            Sign up
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <MuiLink component={Link} to="/login">Sign in</MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
