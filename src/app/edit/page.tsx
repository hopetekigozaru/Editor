import Editor from "@/components/fablic/Editor";
import { createClient } from "@/utils/supabase/server";
import { fabric } from "fabric"; // fabricのインポートが必要

interface keepProps {
  uuid: string;
  title: string;
  fabric_object: fabric.Object | null; // fabric_objectがnullになる可能性も考慮
  width: number;
  height: number;
}

const Register = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const supabase = createClient();
  const { data: keeps, error } = await supabase
    .from("keeps")
    .select("uuid, title, fabric_object, width, height")
    .eq("uuid", searchParams.keep_id);

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error loading data</div>;
  }

  if (!keeps || keeps.length === 0) {
    console.error("No keep found");
    return <div>No keep found</div>;
  }

  const keep = keeps[0] as keepProps; // 最初の要素にアクセス

  return (
    <Editor width={Number(keep.width)} height={Number(keep.height)} keep={keep} />
  );
};

export default Register;
