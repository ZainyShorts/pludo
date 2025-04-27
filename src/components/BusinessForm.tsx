import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { industryOptions } from "@/lib/utils";
import ColorPicker from "./ColorPicker";
import TemplateSelector from "./TemplateSelector"; 
import { formSchema } from "@/lib/utils";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Sparkles, Building2, PenLine, Palette } from "lucide-react";

interface BusinessFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const BusinessForm: React.FC<BusinessFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessDetail: "",
      businessName: "", 
      color: "", 
      template : "",
    }
  });

  const handleFormSubmit = (data: any) => { 
    onSubmit(data);
  };

  return (
    <div className="max-w-3xl min-h-screen mx-auto p-6 bg-[#18181B] rounded-xl border border-neutral-800/50 shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Website Generator</h2>
        <p className="text-neutral-400">Create a professional business website in minutes</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="businessDetail"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="flex justify-between items-center">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <PenLine className="w-4 h-4" />
                    Business Details
                  </FormLabel>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4F46E5]/20 text-[#818CF8] border border-[#4F46E5]/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Powered
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business, including services, brand style, and target audience..."
                    className="w-full min-h-[120px] bg-[#09090B] text-white rounded-md p-3 text-sm border border-neutral-800/50 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition resize-none placeholder:text-neutral-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <Building2 className="w-4 h-4" />
                    Business Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business name"
                      className="w-full bg-[#09090B] text-white rounded-md p-2 text-sm border border-neutral-800/50 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition placeholder:text-neutral-600"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    Template
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-[#fafafa] rounded-md p-2 text-sm border border-neutral-800/50 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none transition">
                        <SelectValue placeholder="Select Template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#c0bfbf] border border-neutral-800/50">
                      {industryOptions.map(option => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value} 
                          className="hover:bg-[#e7e7e7] focus:bg-[#858585]"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                  <Palette className="w-4 h-4" />
                  Brand Color
                </FormLabel>
                <FormControl>
                  <ColorPicker 
                    value={field.value} 
                    onChange={field.onChange}
                    className="pt-2"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="template"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                  Template Style
                </FormLabel>
                <FormControl>
                  <TemplateSelector
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          /> */}
 <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-md font-medium transition duration-200"
          >
            {isLoading ? (
              <div className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </div>
            ) : (
              <div className="inline-flex items-center gap-2">
                Generate Website
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BusinessForm;