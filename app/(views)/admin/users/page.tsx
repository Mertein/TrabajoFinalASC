import Users from "../components/Users/users";
import getRoles from '../../../actions/getRoles';

async function UsersPage() {
  
  const roles = await getRoles(); 

  return (

   <Users roles={roles}/>

  );
};
export default UsersPage;
