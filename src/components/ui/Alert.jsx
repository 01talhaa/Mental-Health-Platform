const Alert = ({ children, variant = 'default', className = '' }) => {
    const variants = {
      default: 'bg-blue-50 text-blue-700 border-blue-200',
      destructive: 'bg-red-50 text-red-700 border-red-200'
    };
  
    return (
      <div className={`p-4 border rounded-md ${variants[variant]} ${className}`}>
        {children}
      </div>
    );
  };
  
  export default Alert;