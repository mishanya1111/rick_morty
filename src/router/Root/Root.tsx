import { Outlet } from 'react-router-dom';

const Root = () => {
  return (
    <div>
      <header>Header (например, навигация)</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Root;
