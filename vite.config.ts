import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {defineConfig, loadEnv} from "vite";

export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        base: "/frontend",
        server: {
            host: true,
            proxy: {
                "/api": {
                    target: process.env.VITE_API_URL
                }
            },
        },
        plugins: [
            react(),
            tsconfigPaths()
        ]
    });
}