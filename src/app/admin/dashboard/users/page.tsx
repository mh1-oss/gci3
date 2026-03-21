import { db } from "@/db";
import { profiles } from "@/db/schema";
import { Users as UsersIcon, ShieldAlert } from "lucide-react";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const allUsers = await db.select().from(profiles).orderBy(desc(profiles.createdAt));

  return (
    <div className="space-y-6 font-arabic">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">إدارة المستخدمين والصلاحيات</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-brand-navy">أعضاء لوحة التحكم والنظام</h3>
        </div>
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">البريد الإلكتروني</th>
              <th className="px-6 py-4 font-medium">الصلاحية</th>
              <th className="px-6 py-4 font-medium">تاريخ الانضمام</th>
              <th className="px-6 py-4 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-brand-navy" dir="ltr" style={{textAlign: "right"}}>{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{user.createdAt?.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-red-500 transition-colors" title="تغيير الصلاحيات">
                    <ShieldAlert className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-500">لا يوجد مستخدمين مسجلين.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
