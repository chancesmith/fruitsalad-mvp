import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import { checkIfClientExists, createClient } from "~/models/client.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");

  const errors = { firstName: null, lastName: null, email: null };

  if (typeof firstName !== "string" || firstName.length === 0) {
    return json(
      { errors: { ...errors, firstName: "First name is required" } },
      { status: 400 }
    );
  }

  if (typeof lastName !== "string" || lastName.length === 0) {
    return json(
      { errors: { ...errors, lastName: "Last name is required" } },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || email.length === 0) {
    return json(
      { errors: { ...errors, email: "Email is required" } },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json(
      { errors: { ...errors, email: "Email is not in the correct format" } },
      { status: 400 }
    );
  }

  const existingClient = await checkIfClientExists({ email });
  if (existingClient) {
    return json(
      {
        errors: { ...errors, email: "A client with this email already exists" },
      },
      { status: 400 }
    );
  }

  const client = await createClient({ firstName, lastName, email, userId });

  return redirect(`/clients/${client.id}`);
}

export default function NewClientPage() {
  const actionData = useActionData<typeof action>();
  const errorsRef = React.useRef(null);
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors && Object.keys(actionData?.errors).length) {
      errorsRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      // blur focus on submit
      onSubmit={() => {}}
    >
      {/* list errors to focus on if there are errors to show */}
      {actionData?.errors && Object.keys(actionData?.errors).length && (
        <div
          ref={errorsRef}
          className="flex flex-col gap-2 border-2 border-red-700 p-4"
          tabIndex={-1}
          aria-label="Errors list"
        >
          <h2>Error list:</h2>
          <ol
            className="flex list-inside list-decimal
          flex-col gap-2
          "
          >
            {actionData?.errors?.firstName && (
              <li className="text-red-700">
                <button
                  type="button"
                  onClick={() => firstNameRef.current?.focus()}
                >
                  {actionData.errors.firstName}
                </button>
              </li>
            )}
            {actionData?.errors?.lastName && (
              <li className="text-red-700">
                <button
                  type="button"
                  onClick={() => lastNameRef.current?.focus()}
                >
                  {actionData.errors.lastName}
                </button>
              </li>
            )}
            {actionData?.errors?.email && (
              <li className="text-red-700">
                <button type="button" onClick={() => emailRef.current?.focus()}>
                  {actionData.errors.email}
                </button>
              </li>
            )}
          </ol>
        </div>
      )}

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>First Name: </span>
          <input
            ref={firstNameRef}
            id="firstName"
            name="firstName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.firstName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.firstName ? "firstName-error" : undefined
            }
            aria-describedby={
              actionData?.errors?.firstName ? "firstName-error" : undefined
            }
            autoComplete="off"
          />
        </label>
        {actionData?.errors?.firstName && (
          <div className="pt-1 text-red-700" id="firstName-error">
            Error: {actionData.errors.firstName}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Email: </span>
          <input
            ref={emailRef}
            id="email"
            name="email"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.email ? true : undefined}
            aria-errormessage={
              actionData?.errors?.email ? "email-error" : undefined
            }
            aria-describedby={
              actionData?.errors?.email ? "email-error" : undefined
            }
            autoComplete="off"
          />
        </label>
        {actionData?.errors?.email && (
          <div className="pt-1 text-red-700" id="email-error">
            Error: {actionData.errors.email}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Last Name: </span>
          <input
            ref={lastNameRef}
            id="lastName"
            name="lastName"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.lastName ? true : undefined}
            aria-errormessage={
              actionData?.errors?.lastName ? "lastName-error" : undefined
            }
            aria-describedby={
              actionData?.errors?.lastName ? "lastName-error" : undefined
            }
            autoComplete="off"
          />
        </label>
        {actionData?.errors?.lastName && (
          <div className="pt-1 text-red-700" id="lastName-error">
            Error: {actionData.errors.lastName}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
