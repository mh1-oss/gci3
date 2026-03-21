export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      {/* Admin dashboard uses English LTR according to standard backend convention, can be toggled to RTL if needed. Adjusting to RTL for unity. */}
      {/* Wait, standard for Arab businesses might be mixed. We will force RTL for unity with main site but separate layout base. */}
      <div dir="rtl" className="min-h-screen flex flex-col font-arabic">
        {children}
      </div>
    </div>
  );
}
