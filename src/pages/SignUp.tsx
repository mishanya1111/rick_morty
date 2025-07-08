import { useNavigate, Link } from "react-router-dom";
import { generateId } from "../utils/generateId";
import { useAuthStore } from "../store/authStore";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailRegex = new RegExp(
  `^(?:[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-zA-Z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@` +
    `(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}|\\[(?:(?:[01]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}(?:[01]?\\d\\d?|2[0-4]\\d|25[0-5])\\])$`
);

const schema = z
  .object({
    name: z
      .string()
      .regex(/^[^$#%&!]*$/, {
        message: "Строка не должна содержать символы $#%&!",
      })
      .refine(
        (val) => val.length <= 10 && val.length >= 4,
        "количество символов в имени должно быть от 4 до 10."
      ),
    email: z
      .string()
      .refine((val) => emailRegex.test(val), {
        message: "Недопустимый формат email",
      })
      .refine(
        (val) => {
          const users = JSON.parse(localStorage.getItem("users") || "{}");
          return !users[val];
        },
        {
          message: "Такой email уже зарегистрирован",
        }
      ),
    password: z
      .string()
      .min(6, "Минимум 6 символов")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Пароль должен содержать хотя бы одну заглавную букву",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Пароль должен содержать хотя бы одну строчную букву",
      })
      .refine((val) => /\d/.test(val), {
        message: "Пароль должен содержать хотя бы одну цифру",
      })
      .refine((val) => /[$#%&!]/.test(val), {
        message: "Пароль должен содержать хотя бы один спецсимвол ($#%&!)",
      }),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "Пароли не совпадают",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export function SignUp() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Данные отправлены:", data);

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const id = generateId();
    users[data.email] = { id, password: data.password, name: data.name };
    localStorage.setItem("users", JSON.stringify(users));

    login(id);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md my-10">
        <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
        <p className="mb-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-black font-semibold">
            Sign In.
          </Link>
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Name:</label>
            <input
              placeholder="Name"
              {...register("name")}
              className="w-full border px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            )}
          </div>
          <div>
            <label>Email:</label>
            <input
              {...register("email")}
              placeholder="Email Address"
              className="w-full border px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            )}
          </div>
          <div>
            <label>Password:</label>
            <input
              placeholder="Password"
              className="w-full border px-3 py-2"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            )}
          </div>
          <div>
            <label>Confirmation password:</label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Password Confirmation"
              className="w-full border px-3 py-2"
              //value={confirmPassword}
              //onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
