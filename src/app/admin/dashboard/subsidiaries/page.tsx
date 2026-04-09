import { getSubsidiaries, createSubsidiary, updateSubsidiary, deleteSubsidiary, reorderSubsidiaries } from "@/app/admin/actions";
import SubsidiaryList from "@/components/admin/SubsidiaryList";

export default async function SubsidiariesPage() {
  const subsidiaries = await getSubsidiaries();
  
  return (
    <div className="space-y-8 font-arabic">
      <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-brand-navy/5 border border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-brand-navy mb-2">الشركات التابعة</h2>
          <p className="text-gray-500">إدارة العلامات التجارية والشركات التابعة لمجموعة AGT</p>
        </div>
      </div>

      <SubsidiaryList 
        initialSubsidiaries={subsidiaries} 
        createAction={createSubsidiary}
        updateAction={updateSubsidiary}
        deleteAction={deleteSubsidiary}
        reorderAction={reorderSubsidiaries}
      />
    </div>
  );
}
