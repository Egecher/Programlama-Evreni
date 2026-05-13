import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

interface DecodedToken extends JwtPayload {
  id?: string;
  userId?: string;
  _id?: string;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar') as DecodedToken;
    const userId = decoded.id || decoded.userId || decoded._id;

    if (!userId) redirect('/login');

    await connectToDatabase();

    const user = await User.findById(userId).select('role').lean();

    if (!user || user.role !== 'admin') redirect('/');
  } catch (error) {
    console.error("Admin yetki kontrolü hatası:", error);
    redirect('/login');
  }

  return (
    <div className="admin-container">
      {children}
    </div>
  );
}