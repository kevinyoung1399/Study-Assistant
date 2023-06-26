import Editor from "@/components/editor";

export default function Content() {
  return (
    <div className="md:container md:mx-auto">
      <p className="text-4xl font-semibold leading-10 text-green-500">
        mock test assistant
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-300">
        Copy and paste your study notes here...
      </h1>
      <Editor />
    </div>
  );
}
