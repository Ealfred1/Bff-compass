-- ============================================================================
-- Fix messages table to support both connections and buddy groups
-- ============================================================================

-- Make connection_id nullable so group messages don't need it
ALTER TABLE public.messages
  ALTER COLUMN connection_id DROP NOT NULL;

-- Add a check constraint to ensure either connection_id OR group_id is set
-- (but not both, and not neither)
ALTER TABLE public.messages
  ADD CONSTRAINT messages_connection_xor_group_check 
  CHECK (
    (connection_id IS NOT NULL AND group_id IS NULL) OR
    (connection_id IS NULL AND group_id IS NOT NULL)
  );

COMMENT ON CONSTRAINT messages_connection_xor_group_check ON public.messages 
IS 'Ensures message belongs to either a connection or a group (but not both)';

-- Update existing messages to satisfy the constraint if needed
-- (This is safe since we haven't created any group messages yet)

