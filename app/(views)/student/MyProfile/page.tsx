import getCurrentUser from '@/app/actions/getCurrentUser';
import FormUser from '@/app/components/FormUser/formUser'


export default async function MyProfilePage() {
  const currentUser = await getCurrentUser();
  return (
    <FormUser user={currentUser}/>
  )
}
