system_binary(
    name="node",
    binary_name="node",
    fingerprint=r"v(19|[2-9][0-9])\..*\..*",
    fingerprint_args=["--version"],
)

system_binary(
    name="pnpm",
    binary_name="pnpm",
    fingerprint=r"1\.([2-9][0-9]|[1-9][0-9][0-9])\..*",
    fingerprint_args=["--version"],
    fingerprint_dependencies=[":node"],
)


run_shell_command(
    name="dev",
    command="pnpm run dev"
)
