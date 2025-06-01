import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hajxzklpckalamtnwyez.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhanh6a2xwY2thbGFtdG53eWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1OTg4MjksImV4cCI6MjA2MzE3NDgyOX0.rG5uD-fyEUVrpLLYGWlJMVhuhHv1FwsKcPianDToKfg"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuários na tabela access_requests...')
    
    // Verificar solicitações de acesso
    const { data: accessRequests, error: accessError } = await supabase
      .from('access_requests')
      .select('*')
    
    if (accessError) {
      console.error('❌ Erro ao buscar access_requests:', accessError)
    } else {
      console.log('✅ Solicitações de acesso encontradas:')
      accessRequests.forEach(request => {
        console.log(`- ${request.name} (${request.email}) - Status: ${request.status}`)
      })
    }

    console.log('\n🔍 Verificando usuários autenticados...')
    
    // Tentar verificar usuários autenticados (isso pode não funcionar com chave anon)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.log('ℹ️ Não foi possível listar usuários autenticados com chave anon')
      console.log('Você precisa criar os usuários manualmente no painel do Supabase')
    } else {
      console.log('✅ Usuários autenticados encontrados:')
      authUsers.users.forEach(user => {
        console.log(`- ${user.email} - ID: ${user.id}`)
      })
    }

    console.log('\n📋 Para criar usuários de teste, use estas credenciais:')
    console.log('1. admin@falaatipica.com - senha: admin123')
    console.log('2. tutor@falaatipica.com - senha: tutor123') 
    console.log('3. pedro@falaatipica.com - senha: pedro123')
    
    console.log('\n🔧 Vá ao painel do Supabase > Authentication > Users e crie estes usuários manualmente')

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

checkUsers()