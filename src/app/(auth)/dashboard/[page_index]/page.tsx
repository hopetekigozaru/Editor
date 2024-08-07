import Dashboard from "@/components/list/Dashboard";


interface DashBoardProps {
  params: { page_index: number }
}

const DashBoard: React.FC<DashBoardProps> = async ({ params }) => {
  let currentPage = params.page_index

  return (
    <>
      <Dashboard currentPage={currentPage} />
    </>
  );
};

export default DashBoard;
