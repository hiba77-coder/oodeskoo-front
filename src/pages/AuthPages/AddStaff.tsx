import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import AddStaffForm from "../../components/auth/AddStaffForm";

export default function AddStaff() {
    return (
        <>
            <PageMeta title="Add Staff | Oodeskoo" description="Create a new staff account" />
            <AuthLayout>
                <AddStaffForm />
            </AuthLayout>
        </>
    );
}