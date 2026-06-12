import type { InputProps } from "../../types/ui";


const Input = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: InputProps) =>{
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default Input