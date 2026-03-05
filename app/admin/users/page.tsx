import { Card } from "@/components/ui/card";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type AuthUserLite = {
  id: string;
  email?: string | null;
  created_at?: string;
};

export default async function AdminUsersPage() {
  const supabase = getSupabaseAdmin();
  const [{ data: profileRows }, usersResp] = await Promise.all([
    supabase.from("profiles").select("user_id,is_admin,full_name,whatsapp_phone"),
    supabase.auth.admin.listUsers({ page: 1, perPage: 200 }),
  ]);

  const users = (usersResp.data.users ?? []) as AuthUserLite[];
  const profileMap = new Map((profileRows ?? []).map((p) => [p.user_id, p]));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Registered Users</h1>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-2 py-2 font-medium">Email</th>
              <th className="px-2 py-2 font-medium">Role</th>
              <th className="px-2 py-2 font-medium">Full name</th>
              <th className="px-2 py-2 font-medium">WhatsApp</th>
              <th className="px-2 py-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const profile = profileMap.get(user.id);
              const createdAt = user.created_at ? new Date(user.created_at).toLocaleString() : "-";
              return (
                <tr key={user.id} className="border-t border-slate-800 text-slate-200">
                  <td className="px-2 py-2">{user.email ?? "-"}</td>
                  <td className="px-2 py-2">
                    {profile?.is_admin ? (
                      <span className="rounded-lg border border-purple-400/40 bg-purple-500/15 px-2 py-1 text-xs text-purple-200">
                        Admin
                      </span>
                    ) : (
                      <span className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-300">User</span>
                    )}
                  </td>
                  <td className="px-2 py-2">{profile?.full_name ?? "-"}</td>
                  <td className="px-2 py-2">{profile?.whatsapp_phone ?? "-"}</td>
                  <td className="px-2 py-2 text-xs text-slate-400">{createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
