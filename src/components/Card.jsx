export default function Card({ image, name, description }) {
  return (
    <div className="max-w-sm p-4 bg-white shadow-xl rounded-2xl space-y-4">
      <img src={image} alt={name} className="h-48 w-48 object-cover mx-auto block rounded shadow-lg" />
      <h1 className="text-xl font-semibold text-gray-800 text-center">{name}</h1>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </div>
  );
}

