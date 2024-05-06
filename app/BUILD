system_binary(
    name="wails",
    binary_name="wails",
    fingerprint=r"v(19|[2-9][0-9])\..*\..*",
    fingerprint_args=["--version"],
)

run_shell_command(
    name="dev",
    command="wails dev"
)

run_shell_command(
    name="build",
    command="wails build"
)

run_shell_command(
    name="build-windows",
    command="wails build -platform windows"
)