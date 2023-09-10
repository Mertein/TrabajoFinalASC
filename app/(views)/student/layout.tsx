import getCurrentUser from "@/app/actions/getCurrentUser";
import SideBar from "./components/SideBar/sideBar";
import TopBar from "@/app/components/TopBar/topBar";


export default async function InstructorLayout({children}: {children: React.ReactNode}) {
  const currentUser = await getCurrentUser();
  return (
    <section> 
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="app">
        
        <SideBar user={currentUser} />
          <main className="content">
            <TopBar />
            {children}
          </main>
      </div>
    </section>
  );
}