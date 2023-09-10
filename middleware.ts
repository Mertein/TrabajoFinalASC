import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
 const url = request.url;
  // const session = await getToken({ req: request, secret: process.env.SECRET_KEY });
  const jwt = await getToken({ req: request, secret: process.env.SECRET_KEY});  

  const isStudent = jwt?.roles?.some(rol => rol.split(',').includes('Student'));

  if(url.includes('/student')) {
    if(!isStudent) {
      return NextResponse.redirect('http://localhost:3000/');
    }
  }

  const isInstructor = jwt?.roles?.some(rol => rol.split(',').includes('Instructor'));

  if(url.includes('/instructor')) {
    if(!isInstructor) {
      return NextResponse.redirect('http://localhost:3000/');
    }
  }

  const isAdmin = jwt?.roles?.some(rol => rol.split(',').includes('Admin'));

  if(url.includes('/admin')) {
    if(!isAdmin) {
      return NextResponse.redirect('http://localhost:3000/');
    }
  }
    return NextResponse.next();
}
 
