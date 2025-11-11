import { Form, useActionData } from "react-router";
import { redirect } from "react-router";
import { login } from "../auth/service";
import type { ActionFunctionArgs } from "react-router";
import { userContext } from "~/auth/context";

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await login({ email, password });

    // Here you should store the token. For example, in a cookie.
    // For simplicity, we are not showing cookie management here.
    // You can use libraries like `js-cookie`.
    // This is a placeholder for where you would set the cookie.
    // document.cookie = `token=${response.payload.token}; path=/;`;

    context.set(userContext, response.payload.user);

    return redirect("/");
  } catch (error: any) {
    return redirect("/auth/login");
  }
}

export default function LoginPage() {
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </Form>
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}
