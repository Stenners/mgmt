import { title } from "@/components/primitives";
import { UserProfile } from "@/components/UserProfile";
import DefaultLayout from "@/layouts/default";

const IndexPage = () => {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ class: "mb-2" })}>Welcome to Your Dashboard</h1>
        <UserProfile />
      </section>
    </DefaultLayout>
  );
};

export default IndexPage;
