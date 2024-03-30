"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Form = ({
  children,
  action,
  className,
}: {
  children: React.ReactNode;
  action: string;
  className?: string;
}) => {
  const router = useRouter();
  return (
    <form
      action={action}
      method="post"
      className={className}
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const response = await fetch(action, {
          method: "POST",
          body: formData,
          redirect: "manual",
        });

        const getData = async () => {
          return await response.json().then((r) => r.error);
        };

        if (!response.ok) {
          try {
            return toast(await getData(), {
              icon: <ExclamationTriangleIcon className="w-6 h-6" />,
            });
          } catch (e) {}
        }

        if (response.status === 0) {
          // redirected
          // when using `redirect: "manual"`, response status 0 is returned
          return router.refresh();
        }
      }}
    >
      {children}
    </form>
  );
};

export default Form;
