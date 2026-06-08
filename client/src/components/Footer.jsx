export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">LaundryKu</p>
        <p>Cucian Bersih, Harum, Tepat Waktu</p>
        <p className="mt-3 text-xs">&copy; {new Date().getFullYear()} LaundryKu. All rights reserved.</p>
      </div>
    </footer>
  );
}
