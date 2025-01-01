const Button = ({ children, variant = 'default', className = '', ...props }) => {
    const variants = {
      default: 'bg-blue-500 hover:bg-blue-600 text-white',
      outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
      ghost: 'text-gray-600 hover:bg-gray-100',
      destructive: 'bg-red-500 hover:bg-red-600 text-white'
    };
  
    return (
      <button 
        className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;