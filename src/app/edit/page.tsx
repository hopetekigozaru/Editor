import Editor from "@/components/fablic/Editor";
import prisma from "@/lib/prisma";


interface keepProps {
    id: number;
    title: string
    fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
    width: number;
    height: number;
}

const getKeepDetail = async (id:number) => {
  const foundKeep = await prisma.keep.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title:true,
      fabric_object: true,
      width: true,
      height:true
    },
  });

  return foundKeep
}

const Register = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const keep = await getKeepDetail(Number(searchParams.keep_id))
  return (
    <Editor width={Number(keep!.width)} height={Number(keep!.height)} keep={keep as keepProps} />
  )
};

export default Register;
