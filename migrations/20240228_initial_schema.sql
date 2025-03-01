-- Create tables for the news bias detector app

-- Enable RLS
alter table auth.users enable row level security;

-- Create articles table
create table public.articles (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    content text not null,
    source text,
    author text,
    date date,
    user_id uuid references auth.users(id) not null
);

-- Create analysis_results table
create table public.analysis_results (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    article_id uuid references public.articles(id) not null,
    overall_bias_score float not null,
    overall_factual_score float not null,
    summary text not null,
    user_id uuid references auth.users(id) not null
);

-- Create biases table
create table public.biases (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    analysis_id uuid references public.analysis_results(id) not null,
    category text not null,
    score float not null,
    explanation text not null
);

-- Create fact_checks table
create table public.fact_checks (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    analysis_id uuid references public.analysis_results(id) not null,
    is_factual boolean not null,
    confidence float not null,
    explanation text not null
);

-- Set up Row Level Security (RLS) policies
alter table public.articles enable row level security;
alter table public.analysis_results enable row level security;
alter table public.biases enable row level security;
alter table public.fact_checks enable row level security;

-- Articles policies
create policy "Users can insert their own articles"
    on public.articles for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own articles"
    on public.articles for select
    using (auth.uid() = user_id);

-- Analysis results policies
create policy "Users can insert their own analysis results"
    on public.analysis_results for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own analysis results"
    on public.analysis_results for select
    using (auth.uid() = user_id);

-- Biases policies
create policy "Users can insert biases for their analyses"
    on public.biases for insert
    with check (exists (
        select 1 from public.analysis_results
        where id = analysis_id and user_id = auth.uid()
    ));

create policy "Users can view biases for their analyses"
    on public.biases for select
    using (exists (
        select 1 from public.analysis_results
        where id = analysis_id and user_id = auth.uid()
    ));

-- Fact checks policies
create policy "Users can insert fact checks for their analyses"
    on public.fact_checks for insert
    with check (exists (
        select 1 from public.analysis_results
        where id = analysis_id and user_id = auth.uid()
    ));

create policy "Users can view fact checks for their analyses"
    on public.fact_checks for select
    using (exists (
        select 1 from public.analysis_results
        where id = analysis_id and user_id = auth.uid()
    )); 