<script lang="ts">
  export let title: string
  export let dueDate: string
  export let frequency: string
  export let isOverdue: boolean

  function formatDueDate(date: string) {
    const now = new Date()
    const dueDate = new Date(date)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Due ${Math.abs(diffDays)} days ago.`
    } else if (diffDays === 0) {
      return "Due today."
    } else {
      return `Due on the ${dueDate.getDate()}${getOrdinalSuffix(dueDate.getDate())} ${dueDate.toLocaleString("default", { month: "long" })} ${dueDate.getFullYear()}.`
    }
  }

  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  function formatFrequency(freq: string) {
    switch (freq) {
      case "monthly":
        return "Every month"
      case "bimonthly":
        return "Every 2 months"
      case "quarterly":
        return "Every 3 months"
      case "biannually":
        return "Every 6 months"
      case "annually":
        return "Every year"
      default:
        return freq
    }
  }
</script>

<div class="bg-white p-6 rounded-2xl shadow-sm border">
  <h3 class="text-lg font-semibold mb-2">{title}</h3>
  <p class={`text-sm mb-1 ${isOverdue ? "text-error" : "text-gray-600"}`}>
    {formatDueDate(dueDate)}
  </p>
  <p class="text-sm text-gray-600 mb-4">
    {formatFrequency(frequency)}
  </p>
  <button class="btn btn-sm btn-outline rounded-full">
    Mark as Complete
  </button>
</div>
