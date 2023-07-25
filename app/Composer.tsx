"use client";

import { api } from "@/convex/_generated/api";
import { CHARACTER_LIMIT } from "@/convex/shared";
import { UserButton } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { useFormik } from "formik";
import useStoreUserEffect from "./useStoreUserEffect";

export function Composer() {
  const userId = useStoreUserEffect();
  const createPost = useMutation(api.posts.create);
  const formik = useFormik({
    initialValues: {
      text: "",
    },
    onSubmit: async (values) => {
      try {
        await createPost({ ...values, authorId: userId! });
        formik.resetForm();
      } catch (e) {
        formik.setErrors({ text: "Couldn't send this post, try later" });
      }
    },
  });
  const charCount = formik.values.text.length;
  const isOverLimit = charCount > CHARACTER_LIMIT;
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <div className="authorButton">
            <UserButton afterSignOutUrl="/" />
          </div>
          <input
            placeholder="What's up?"
            type="text"
            id="text"
            {...formik.getFieldProps("text")}
          />
          <button
            type="submit"
            disabled={
              userId === undefined || formik.values.text === "" || isOverLimit
            }
          >
            Post
          </button>
        </div>
        {formik.errors.text !== undefined ? (
          <div className="error">{formik.errors.text}</div>
        ) : null}
        <div
          className={`characterLimit ${
            isOverLimit ? "characterLimitOver" : ""
          }`}
          style={{
            width: `${Math.min(100, (100 * charCount) / CHARACTER_LIMIT)}%`,
          }}
        />
      </form>
    </>
  );
}
