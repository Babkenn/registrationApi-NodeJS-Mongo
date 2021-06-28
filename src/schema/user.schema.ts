import { object, string, ref, number } from "yup";

export const createUserSchema = object({
    body: object({
        firstName: string().required("First Name is Required"),
        lastName: string().required("Last Name is Required"),
        age: number().required("Age is Required"),
        email: string()
        .email("Must be a valid email")
        .required("Email is required"),
        password: string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 char minimum"),
        passwordConfirmation: string().oneOf(
            [ref("password"), null],
            "Password must match"
        )
    })
});

export const createUserSessionSchema = object({
    body: object({
      password: string()
        .required("Password is required")
        .min(6, "Password is too short - should be 6 chars minimum."),
      email: string()
        .email("Must be a valid email")
        .required("Email is required"),
    }),
});

export const searchUserSchema = object({
    body: object({
        firstName: string(),
        lastName: string(),
        age: number(),
    }),
});

export const friendRequestSchema = object({
    body: object({
        email: string()
        .email("Must be a valid email")
        .required("Email is required"),
    }),
});


