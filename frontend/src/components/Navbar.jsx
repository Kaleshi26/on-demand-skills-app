
function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">On-Demand Skills</h1>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Services</a></li>
        <li><a href="#" className="hover:underline">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
