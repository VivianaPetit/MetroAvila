import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Table from '../components/ActivityTable.jsx';

function AdminProfilePage() {
    return (
        <div>
            <Header />
            <div style={{ padding: '0 5%', marginTop: '20px', marginBottom: '20px' }}> 
                <Table />
            </div>
            <Footer />
        </div>
    );
}

export default AdminProfilePage;
