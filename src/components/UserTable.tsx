const getStatusFromDate = (lastActiveDate: string) => {
  const lastActive = new Date(lastActiveDate);
  const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceActive <= 7) return { status: 'Active', className: 'active' };
  if (daysSinceActive <= 30) return { status: 'Pending', className: 'pending' };
  return { status: 'Inactive', className: 'inactive' };
};

const SortableHeader = ({ 
  children, 
  field, 
  sortField, 
  sortDirection, 
  onSort 
}: {
const LoadingSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="table-row">
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E2E8F0' }} />
              <div>
                <div style={{ width: '120px', height: '16px', background: '#E2E8F0', borderRadius: '4px', marginBottom: '4px' }} />
                <div style={{ width: '80px', height: '12px', background: '#E2E8F0', borderRadius: '4px' }} />
              </div>
            </div>
          </td>
          <td><div style={{ width: '100px', height: '16px', background: '#E2E8F0', borderRadius: '4px' }} /></td>
          <td><div style={{ width: '120px', height: '16px', background: '#E2E8F0', borderRadius: '4px' }} /></td>
          <td><div style={{ width: '90px', height: '16px', background: '#E2E8F0', borderRadius: '4px' }} /></td>
          <td><div style={{ width: '140px', height: '16px', background: '#E2E8F0', borderRadius: '4px' }} /></td>
          <td><div style={{ width: '70px', height: '24px', background: '#E2E8F0', borderRadius: '12px' }} /></td>
          <td><FiMoreVertical color="#545F7D" /></td>
        </tr>
      ))}
    </>
  );
};

export const UserTable: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredUsers,
    loading,
    currentPage,
    pageSize,
    sortField,
    sortDirection,
    setCurrentPage,
    setPageSize,
    setSorting,
  } = useUserStore();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleViewUser = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Organization
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Username
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Email
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Phone Number
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Date Joined
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Status
                  <FiFilter size={16} color="#545F7D" />
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="table-body">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              paginatedUsers.map((user) => {
                const { status, className } = getStatusFromDate(user.lastActiveDate);
                
                return (
                  <tr 
                    key={user.id}
                    className="table-row"
                    onClick={() => handleViewUser(user.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{user.orgName}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}</td>
                    <td>
                      <span className={`status-pill ${className}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-menu-trigger"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiMoreVertical color="#545F7D" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="pagination-container">
        <div className="pagination-info">
          <span className="pagination-text">
            Showing
          </span>
          <select 
            className="page-size-selector"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={10}>100</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="pagination-text">
            out of {filteredUsers.length}
          </span>
        </div>
        
        <div className="pagination-controls">
          <button 
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            
            return (
              <button
                key={pageNum}
                className={`pagination-button ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <span className="pagination-text">...</span>
              <button
                className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button 
            className="pagination-button"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};