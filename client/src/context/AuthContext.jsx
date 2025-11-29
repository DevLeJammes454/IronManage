return { success: true };
        } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Registration failed' };
}
    };

const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
};

return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
);
};
