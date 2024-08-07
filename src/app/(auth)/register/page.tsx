import Editor from "@/components/fablic/Editor";

const Register = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  return (
    <Editor aspectRatio={Number(searchParams.width) / Number(searchParams.height) } keep={null} />
  )
};

export default Register;
