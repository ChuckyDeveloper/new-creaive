import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export default function ProductsIndex() {
    redirect("/product-test/page1");
}
