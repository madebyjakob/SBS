import React, { useState, useEffect } from 'react';

export default function LoanRequestsTable() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({ id: null, message: '', type: '' });

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const fetchLoanRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/loan-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch loan requests');
      }
      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError('Failed to load loan requests. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch(`/api/loan-requests/${requestId}/${action}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} request`);
      }

      // Update local state
      if (action === 'approve') {
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'approved' } : req
          )
        );
        setActionStatus({
          id: requestId,
          message: 'Låneförfrågan godkänd',
          type: 'success'
        });
      } else if (action === 'reject') {
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
          )
        );
        setActionStatus({
          id: requestId,
          message: 'Låneförfrågan avvisad',
          type: 'success'
        });
      }

      // Clear status message after 3 seconds
      setTimeout(() => {
        setActionStatus({ id: null, message: '', type: '' });
      }, 3000);
    } catch (err) {
      setActionStatus({
        id: requestId,
        message: `Fel: ${err.message}`,
        type: 'error'
      });
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Laddar låneförfrågningar...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded">
        <p className="text-gray-500">Det finns inga väntande låneförfrågningar.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Låneförfrågningar</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-left">Användare</th>
              <th className="py-3 px-4 border-b text-left">Bok</th>
              <th className="py-3 px-4 border-b text-left">ISBN</th>
              <th className="py-3 px-4 border-b text-left">Datum</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
              <th className="py-3 px-4 border-b text-left">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{request.userName}</td>
                <td className="py-3 px-4 border-b">{request.bookTitle}</td>
                <td className="py-3 px-4 border-b">{request.isbn}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(request.requestDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status === 'pending' ? 'Väntar' :
                     request.status === 'approved' ? 'Godkänd' : 'Avvisad'}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(request.id, 'approve')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Godkänn
                      </button>
                      <button
                        onClick={() => handleAction(request.id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Avvisa
                      </button>
                    </div>
                  )}
                  {actionStatus.id === request.id && (
                    <div className={`mt-1 text-sm ${
                      actionStatus.type === 'error' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {actionStatus.message}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}