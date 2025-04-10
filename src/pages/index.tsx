import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const IndexPage = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ class: "mb-2" })}>Dashboard</h1>
        <p className="text-lg text-default-500">Welcome to your management dashboard</p>
      </section>
    </DefaultLayout>
  );
};

export default IndexPage;
