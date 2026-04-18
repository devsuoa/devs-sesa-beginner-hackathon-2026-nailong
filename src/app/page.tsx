import Starfield from "./starfield";

export default function Home() {
  return (
    <div>
		<Starfield />
		<div className="w-1/4 h-16 bg-blue-200 flex items-center justify-center mb-4 text-black mx-auto rounded-lg">
			Pick Up Planet
		</div>
		<div className="w-1/4 h-16 bg-green-200 flex items-center justify-center mb-4 text-black mx-auto rounded-lg">
			Drop Off Planet
		</div>
		<button className="w-1/4 h-16 flex items-center justify-center mb-4 mx-auto">
			Submit
		</button>
    </div>
  );
}
