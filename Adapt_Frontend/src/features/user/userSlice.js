import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios.js'
import toast from 'react-hot-toast'


const initialState = {
    value: null,
    status: 'idle',
    error: null,
}

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (token, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/api/user/data', {
                headers: {Authorization: `Bearer ${token}`}
            })

            if (!data.success || !data.user) {
                return rejectWithValue(data.message || 'Nao foi possivel carregar o usuario.')
            }

            return data.user
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || error.message || 'Erro ao carregar usuario.')
        }
    }
)

export const updateUser = createAsyncThunk(
    'user/update',
    async ({userData, token}, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/api/user/update', userData, {
                headers: {Authorization: `Bearer ${token}`}
            })
            if(data.success){
                toast.success(data.message)
                return data.user
            }

            toast.error(data.message)
            return rejectWithValue(data.message || 'Nao foi possivel atualizar o perfil.')
        } catch (error) {
            const message = error?.response?.data?.message || error.message || 'Erro ao atualizar perfil.'
            toast.error(message)
            return rejectWithValue(message)
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        
    },
    extraReducers: (builder)=>{
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchUser.fulfilled, (state, action)=>{
                state.value = action.payload
                state.status = 'succeeded'
                state.error = null
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.value = null
                state.status = 'failed'
                state.error = action.payload || action.error.message || null
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(updateUser.fulfilled, (state, action)=>{
                state.value = action.payload
                state.status = 'succeeded'
                state.error = null
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload || action.error.message || null
            })
    }
})

export default userSlice.reducer
