import { ReactNode } from "react";


type LoginLayoutProps = {
  children: ReactNode;
};

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="w-full h-[90vh] flex justify-center items-center">
        <div className="border-4 border-solid border-secondary p-10 md:p-20 rounded-2xl w-11/12 md:w-1/2">
          {children}
        </div>
      </div>
    </>
  );
};

export default LoginLayout;
