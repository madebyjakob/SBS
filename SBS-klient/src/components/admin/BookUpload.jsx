import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function BookUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Validate required columns
          const requiredColumns = ['ISBN', 'title', 'author', 'instock', 'loaner'];
          const headers = Object.keys(jsonData[0] || {});
          
          const missingColumns = requiredColumns.filter(col => 
            !headers.some(header => header.toLowerCase() === col.toLowerCase())
          );
          
          if (missingColumns.length > 0) {
            setMessage({
              text: `Saknade kolumner: ${missingColumns.join(', ')}`,
              type: 'error'
            });
            setPreview([]);
            return;
          }
          
          setPreview(jsonData.slice(0, 5)); // Show first 5 rows as preview
          setMessage({ text: '', type: '' });
        } catch (error) {
          setMessage({
            text: 'Kunde inte läsa filen. Kontrollera att det är en giltig Excel-fil.',
            type: 'error'
          });
          setPreview([]);
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } else {
      setPreview([]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ text: 'Ingen fil vald', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Send data to API
          const response = await fetch('/api/books/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ books: jsonData }),
          });

          if (!response.ok) {
            throw new Error('Server responded with an error');
          }

          const result = await response.json();
          setMessage({
            text: `${result.added} böcker har lagts till framgångsrikt!`,
            type: 'success'
          });
          setFile(null);
          setPreview([]);
          
          // Reset file input
          document.getElementById('file-upload').value = '';
        } catch (error) {
          setMessage({
            text: 'Ett fel uppstod vid uppladdning: ' + error.message,
            type: 'error'
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      setMessage({
        text: 'Ett fel uppstod: ' + error.message,
        type: 'error'
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Ladda upp böcker från Excel</h2>
      
      <div className="mb-6">
        <p className="mb-2">Ladda upp en Excel-fil med följande kolumner:</p>
        <div className="bg-gray-100 p-3 rounded">
          <code>ISBN, title, author, instock, loaner</code>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Välj Excel-fil</label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {preview.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Förhandsgranskning (första 5 rader)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  {Object.keys(preview[0]).map((header) => (
                    <th key={header} className="py-2 px-4 border-b text-left">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-2 px-4 border-b">
                        {cell?.toString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className={`px-4 py-2 rounded font-medium ${
          !file || isLoading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Laddar upp...' : 'Ladda upp böcker'}
      </button>
    </div>
  );
}